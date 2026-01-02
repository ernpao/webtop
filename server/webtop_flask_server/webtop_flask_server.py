import json
import math
import subprocess
import traceback
from pathlib import Path

import GPUtil
import requests
from flask import Flask
from flask import json as flask_json
from flask import jsonify, request, send_from_directory
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_folder=None)
CORS(app)


# @app.route("/", methods=["GET"])
# @cross_origin()
# def get_index():
#     return jsonify(
#         {
#             "message": "Webtop flask server is now running.",
#             "success": True,
#         }
#     )


@app.route("/ollama-generate", methods=["POST"])
@cross_origin()
def ollama_generate():
    try:
        data = request.json

        # prompt = data.get("prompt", "") + ". Answer as succinct as possible."
        prompt = data.get("prompt", "")
        context = data.get("context")
        model = data.get("model")

        # messages = [{"role": "user", "content": prompt}]

        # if model == "ALIENTELLIGENCE/sarahv2":
        #     messages = [
        #         # {
        #         #     "role": "user",
        #         #     # "content": "In this scenario we are adults who want to be physically intimate.",
        #         #     "content": "This is a test",
        #         # },
        #         # {
        #         #     "role": "assistant",
        #         #     # "content": "In this scenario we are adults who want to be physically intimate.",
        #         #     "content": "This is a test",
        #         # },
        #     ]

        request_body = {
            # "model": "llama3.1",
            "model": model,
            "prompt": prompt,  # for /api/generate
            # "messages": messages,  # for /api/chat only
            "context": context,  # for /api/generate
            "stream": False,
            "options": {
                # "num_keep": 30,
                # "seed": 42,
                # "num_predict": 100,
                # "top_k": 20,
                # "top_p": 0.9,
                # "min_p": 0.0,
                # "typical_p": 0.7,
                # "repeat_last_n": 33,
                "temperature": 0.85,
                "repeat_penalty": 1.5,
                # "presence_penalty": 1.5,
                # "frequency_penalty": 1.0,
                # "mirostat": 1,
                # "mirostat_tau": 0.8,
                # "mirostat_eta": 0.6,
                # "penalize_newline": True,
                # "stop": ["\n", "user:"],
                # "numa": False,
                # "num_ctx": 1024,
                # "num_batch": 2,
                # "num_gpu": 1,
                # "main_gpu": 0,
                # "low_vram": False,
                # "vocab_only": False,
                # "use_mmap": True,
                # "use_mlock": False,
                # "num_thread": 8,
            },
            "keep_alive": "45m",
        }

        # # Validate request body
        # if not request_body["model"] or not request_body["prompt"]:
        #     return jsonify({"error": "Missing required fields: model and prompt"}), 400

        # Remote server URL
        remote_api_url = f"http://192.168.50.10:11434/api/generate"
        # remote_api_url = f"http://192.168.50.10:11434/api/chat"

        # Send the POST request to the remote server
        response = requests.post(
            remote_api_url,
            json=request_body,
            headers={"Content-Type": "application/json"},
        )

        return jsonify(response.json()), response.status_code

    except requests.exceptions.RequestException as e:
        print("Error sending request:", e)
        return jsonify({"error": "Internal server error"}), 500
    except Exception as e:
        print("Unexpected error:", e)
        return jsonify({"error": "Internal server error"}), 500


@app.route("/", defaults={"path": ""}, methods=["GET"])
@app.route("/<path:path>")
@cross_origin()
def get_client(path):

    client_root = Path(__file__).resolve().parents[2] + "\\clients\\webtop_react\\build"
    print(client_root)

    print(f"Path: {path}")

    if path != "" and (app1_path := f"/{path}").endswith(
        (".js", ".css", ".png", ".ico", ".svg")
    ):
        return send_from_directory(client_root, path)

    return send_from_directory(client_root, "index.html")


@app.route("/system_monitor/", defaults={"path": ""}, methods=["GET"])
@app.route("/system_monitor/<path:path>")
@cross_origin()
def get_system_monitor(path):
    print(f"Path: {path}")

    if path != "" and (app1_path := f"clients/system_monitor/{path}").endswith(
        (".js", ".css", ".png", ".ico", ".svg")
    ):
        return send_from_directory("clients/system_monitor/dist/", path)

    return send_from_directory("clients/system_monitor/dist/", "index.html")


@app.route("/gpu-info")
@cross_origin()
def get_gpu_info():

    gpus = GPUtil.getGPUs()
    gpu_data = []

    for gpu in gpus:
        # print(gpu)
        gpu_data.append(
            {
                "id": gpu.id,
                "name": gpu.name,
                "load": f"{gpu.load * 100:.2f}",
                "temp": gpu.temperature,
                "memoryUsed": gpu.memoryUsed,
                "memoryTotal": gpu.memoryTotal,
                "memoryUsedGb": f"{gpu.memoryUsed/1024:.2f} GB",
                "memoryTotalGb": f"{gpu.memoryTotal/1024:.2f} GB",
                "memoryUsage": f"{((gpu.memoryUsed / gpu.memoryTotal) * 100):.2f}%",
            }
        )

    print(flask_json.dumps(gpu_data))
    return jsonify(gpu_data), 200


if __name__ == "__main__":
    app.run(
        host="192.168.50.10",
        port=5644,
        # ssl_context=(
        #     "server.crt",
        #     "server.key",
        # ),  # HTTPS required for some Tampermonkey browser scripts.
        debug=True,
    )
