package mw

import (
	"bytes"
	"github.com/rs/zerolog/log"
	"io/ioutil"
	"net/http"
	"time"
)

func LoggerMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()
		rec := &ResponseRecorder{
			ResponseWriter: w,
			StatusCode:     http.StatusOK,
		}

		//Log request body if there is one
		if r.Body != nil {
			body, err := ioutil.ReadAll(r.Body)
			if err == nil {
				if body != nil {
					log.Info().Bytes("request_body", body).Msg("Received request body")
					r.Body = ioutil.NopCloser(bytes.NewBuffer(body))
				}

			}
		}

		next.ServeHTTP(rec, r)
		duration := time.Since(startTime)
		logger := log.Info()
		if rec.StatusCode != http.StatusOK {
			logger = log.Error().Bytes("body", rec.Body)
		}

		logger.Str("protocol", "http").
			Str("method", r.Method).
			Str("path", r.RequestURI).
			Int("status_code", rec.StatusCode).
			Str("status_text", http.StatusText(rec.StatusCode)).
			Dur("duration", duration).
			Msgf("%s received a HTTP request", time.Now().UTC().Format("2006-01-02"))
	}
}

type ResponseRecorder struct {
	http.ResponseWriter
	StatusCode int
	Body       []byte
}

func (rec *ResponseRecorder) WriteHeader(statusCode int) {
	rec.StatusCode = statusCode
	rec.ResponseWriter.WriteHeader(statusCode)
}

func (rec *ResponseRecorder) Write(body []byte) (int, error) {
	rec.Body = body
	return rec.ResponseWriter.Write(body)
}
