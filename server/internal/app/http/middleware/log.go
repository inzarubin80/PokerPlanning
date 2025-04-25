package middleware

import (
	"fmt"
	"net/http"
	"net/http/httputil"
)

type LogMux struct {
	h http.Handler
}

func NewLogMux(h http.Handler) http.Handler {

	return &LogMux{h: h}

}

func (m *LogMux) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	dumpR, err := httputil.DumpRequest(r, true)

	if err != nil {
		fmt.Println("Failed to dump request", err.Error())
	} else {
		fmt.Println("Request", string(dumpR))
	}

	m.h.ServeHTTP(w, r)
}
