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
//	metrics.IncRequestCounter(r.URL.Path)
	//ctx := r.Context()

//	start := time.Now()

	dumpR, err := httputil.DumpRequest(r, true)
	if err != nil {
  	fmt.Println("Failed to dump request", err.Error())
	} else {
		fmt.Println("Request", string(dumpR))
//		loggerPkg.Errorw(ctx, "Request", zap.String("request", string(dumpR)))
	}

	//recorder := &responseRecorder{ResponseWriter: w, status: http.StatusOK}

	m.h.ServeHTTP(w, r)

//	metrics.StoreHandlerDuration(r.URL.Path, strconv.Itoa(recorder.status), time.Since(start))
}