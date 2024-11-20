package uhttp
import (
	"net/http"
	"encoding/json"
)

type errorResponse struct {
	Error   bool   `json:"error"`
	Message string `json:"message"`
}

func SendSuccessfulResponse(w http.ResponseWriter, jsonContent []byte) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonContent)
}

func SendErrorResponse(w http.ResponseWriter, statusCode int, Message string) {

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	jsonData, _ := json.Marshal(errorResponse{Error: true, Message: Message})
	w.Write(jsonData)

}
