package handler

import (
	"fmt"
	"net/http"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func (h Handler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req LoginRequest) (LoginResponse, error) {
		isValid, err := h.service.CheckCredentials(r.Context(), req.Username, req.Password)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return LoginResponse{}, fmt.Errorf("erro checking credentials: %w", err)
		}

		if isValid {
			tokenString, err := h.service.CreateToken(req.Username)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return LoginResponse{}, fmt.Errorf("cant generate token: %w", err)
			}
			return LoginResponse{Token: tokenString}, nil
		} else {
			w.WriteHeader(http.StatusUnauthorized)
			return LoginResponse{}, fmt.Errorf("wrong credentials")
		}
	})
}
