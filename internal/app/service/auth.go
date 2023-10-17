package service

import (
	"context"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"metallplace/internal/app/model"
	"net/http"
	"time"
)

func (s *Service) CheckCredentials(ctx context.Context, user, password string) (bool, error) {
	return s.repo.CheckCredentials(ctx, user, password)
}

func (s *Service) CreateToken(username string) (string, error) {
	expirationTime := time.Unix(1<<63-1, 0)
	claims := &model.Claims{
		Username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.cfg.AuthKey)
}

func (s *Service) Authenticate(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		token, err := jwt.ParseWithClaims(tokenString, &model.Claims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return s.cfg.AuthKey, nil
		})
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		if !token.Valid {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	}
}

func (s *Service) GetUserFromJWT(r *http.Request) (string, error) {
	tokenString := r.Header.Get("Authorization")

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(s.cfg.AuthKey), nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		user, ok2 := claims["username"].(string)
		if !ok2 {
			return "", fmt.Errorf("user claim not found in token")
		}
		return user, nil
	} else {
		return "", err
	}
}
