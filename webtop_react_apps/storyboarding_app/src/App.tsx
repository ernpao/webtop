import React, { useRef, useState, useEffect } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GripVertical } from 'lucide-react';

function App() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [jsonData, setJsonData] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);

  useEffect(() => {
    document.title = `${unsavedChanges ? '*' : ''}${fileName || 'Storyboard Viewer'}`;
  }, [fileName, unsavedChanges]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const parsed = JSON.parse(result);
            setJsonData(parsed);
            setFileName(file.name);
            setSelectedSceneIndex(0);
            setUnsavedChanges(false);
          } else {
            alert("File read error: result is not a string");
          }
        } catch (err) {
          alert("Invalid JSON file.");
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please select a .json file");
    }
  };

  const handleSave = () => {
    if (!jsonData) return;
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName || 'storyboard.json';
    a.click();
    setUnsavedChanges(false);
  };

  const moveScene = (dragIndex: number, hoverIndex: number) => {
    const updatedScenes = [...jsonData.scenes];
    const [removed] = updatedScenes.splice(dragIndex, 1);
    updatedScenes.splice(hoverIndex, 0, removed);
    setJsonData({ ...jsonData, scenes: updatedScenes });
    setUnsavedChanges(true);
  };

  const moveBoard = (dragIndex: number, hoverIndex: number) => {
    const updatedBoards = [...jsonData.scenes[selectedSceneIndex].boards];
    const [removed] = updatedBoards.splice(dragIndex, 1);
    updatedBoards.splice(hoverIndex, 0, removed);
    const updatedScenes = [...jsonData.scenes];
    updatedScenes[selectedSceneIndex].boards = updatedBoards;
    setJsonData({ ...jsonData, scenes: updatedScenes });
    setUnsavedChanges(true);
  };

  const SceneItem = ({ scene, index }: any) => {
    const ref = useRef(null);
    const [, drop] = useDrop({
      accept: 'scene',
      hover(item: any) {
        if (item.index !== index) {
          moveScene(item.index, index);
          item.index = index;
        }
      },
    });
    const [{ isDragging }, drag, preview] = useDrag({
      type: 'scene',
      item: { index },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });
    drag(drop(ref));

    return (
      <div
        ref={ref}
        className={`p-2 mb-2 rounded cursor-pointer flex items-center justify-between ${index === selectedSceneIndex ? 'bg-gray-600' : 'bg-gray-700'} hover:bg-gray-600`}
        onClick={() => setSelectedSceneIndex(index)}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <span>{scene.name || `Scene ${index + 1}`}</span>
        <GripVertical className="ml-2 h-4 w-4 text-gray-400" />
      </div>
    );
  };

  const BoardItem = ({ board, index }: any) => {
    const ref = useRef(null);
    const [, drop] = useDrop({
      accept: 'board',
      hover(item: any) {
        if (item.index !== index) {
          moveBoard(item.index, index);
          item.index = index;
        }
      },
    });
    const [{ isDragging }, drag] = useDrag({
      type: 'board',
      item: { index },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });
    drag(drop(ref));

    return (
      <div
        ref={ref}
        key={index}
        className="bg-gray-800 p-4 rounded shadow cursor-move"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <h3 className="text-lg font-semibold mb-2">{board.title || `Board ${index + 1}`}</h3>
        <p className="text-sm text-gray-400 mb-2">{board.notes?.title}</p>
        <p className="text-sm">{board.notes?.text}</p>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        {/* Top Menu Bar */}
        <div className="fixed top-0 left-0 right-0 z-20 flex items-center p-4 bg-gray-800 shadow-md">
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-4 py-2 hover:bg-gray-700 rounded"
            >
              File
            </button>
            {menuOpen && (
              <div className="absolute mt-1 bg-gray-700 rounded shadow-lg">
                <button
                  onClick={() => {
                    handleFileClick();
                    setMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-left w-full hover:bg-gray-600"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    handleSave();
                    setMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-left w-full hover:bg-gray-600"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Content Area */}
        <div className="flex pt-20 flex-1">
          {/* Sidebar for Scenes */}
          {jsonData?.scenes && (
            <div className="w-64 bg-gray-800 p-4 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-2">Scenes</h2>
              {jsonData.scenes.map((scene: any, index: number) => (
                <SceneItem key={index} scene={scene} index={index} />
              ))}
            </div>
          )}

          {/* Main Display */}
          <div className="flex-1 p-4 overflow-y-auto">
            {jsonData ? (
              <>
                {/* Board Grid */}
                {jsonData.scenes && jsonData.scenes.length > 0 && jsonData.scenes[selectedSceneIndex]?.boards ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {jsonData.scenes[selectedSceneIndex].boards.map((board: any, idx: number) => (
                      <BoardItem key={idx} board={board} index={idx} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No boards found in selected scene.</p>
                )}
              </>
            ) : (
              <p className="text-gray-400">No file loaded. Use File → Open to select a JSON file.</p>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
