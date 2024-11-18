package uhttp
import "net/http"

func SendResponse(w http.ResponseWriter, statusCode int, jsonContent []byte) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	w.Write(jsonContent)
}
