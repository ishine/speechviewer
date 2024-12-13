import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { Toaster } from "react-hot-toast";
import SpeechEditor from "./SpeechEditor.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<SpeechEditor />
		<Toaster />
	</StrictMode>,
);
