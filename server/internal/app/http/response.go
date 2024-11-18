package http

import "net/http"

func sendResponse(w http.ResponseWriter, statusCode int, jsonContent []byte) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	w.Write(jsonContent)
}
