package tokenservice

import (
	"fmt"
	"github.com/golang-jwt/jwt"
	"inzarubin80/PokerPlanning/internal/model"
	"time"
)

type (
	tokenService struct {
		secretKey []byte
		duration  time.Duration
		tokenType string
	}
)

func NewtokenService(secretKey []byte, duration time.Duration, tokenType string) *tokenService {
	return &tokenService{
		secretKey: secretKey,
		duration:  duration,
		tokenType: tokenType,
	}

}

func (a *tokenService) GenerateToken(userID model.UserID) (string, error) {

	claims := &model.Claims{
		UserID:    userID,
		TokenType: a.tokenType,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(a.duration).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(a.secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (a *tokenService) ValidateToken(tokenString string) (*model.Claims, error) {

	token, err := jwt.ParseWithClaims(tokenString, &model.Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return a.secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*model.Claims); ok && token.Valid && claims.TokenType == a.tokenType {
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token")
}
