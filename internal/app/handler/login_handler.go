package handler

import (
	"fmt"
	"net/http"
)

// LoginRequest example
type LoginRequest struct {
	Username string `json:"username" example:"user" format:"string"`
	Password string `json:"password" example:"password" format:"string"`
}

// LoginResponse example
type LoginResponse struct {
	Token string `json:"token" example:"token" format:"string"`
}

// LoginHandler godoc
//
//	@Summary		Log in
//	@Description	log in with username and password
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Param request body LoginRequest true "query params"
//	@Success		200	{object}	LoginResponse
//	@Failure		400	{object}	ErrorResponse
//	@Failure		404	{object}	ErrorResponse
//	@Failure		500	{object}	ErrorResponse
//	@Router			/login [post]
func (h Handler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req LoginRequest) (LoginResponse, error) {

		isValid, err := h.service.CheckCredentials(r.Context(), req.Username, req.Password)
		if err != nil {
			SentrySend(r, err)
			w.WriteHeader(http.StatusInternalServerError)
			return LoginResponse{}, fmt.Errorf("error checking credentials: %w", err)
		}

		if isValid {
			tokenString, err := h.service.CreateToken(req.Username)
			if err != nil {
				SentrySend(r, err)
				w.WriteHeader(http.StatusInternalServerError)
				return LoginResponse{}, fmt.Errorf("cant generate token: %w", err)
			}
			return LoginResponse{Token: tokenString}, nil
		} else {
			return LoginResponse{}, fmt.Errorf("wrong credentials")
		}
	})
}
