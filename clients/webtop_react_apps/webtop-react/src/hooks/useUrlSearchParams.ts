
import { useLocation } from "react-router-dom";

export function useUrlSearchParams(name: string) {
    var params = new URLSearchParams(useLocation().search);
    const val = params.get(name)
    return { val }
}


