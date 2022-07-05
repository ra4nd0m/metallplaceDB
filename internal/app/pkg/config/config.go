package config

import (
	"github.com/joho/godotenv"
	"log"
	"os"
	"strconv"
)

type Config struct {
	DBHost     string
	DBPort     int
	DBUser     string
	DBPassword string
	DBName     string
	HttpPort   string
}

func LoadConfig() (Config, error) {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file")
	}

	port, _ := strconv.Atoi(os.Getenv("DB_PORT"))
	config := Config{
		DBHost:     os.Getenv("DB_HOST"),
		DBPort:     port,
		DBUser:     os.Getenv("DB_USER"),
		DBPassword: os.Getenv("DB_PASSWORD"),
		DBName:     os.Getenv("DB_NAME"),
		HttpPort:   os.Getenv("HTTP_PORT"),
	}

	log.Printf("config: %#v\n", config)
	return config, nil
}
