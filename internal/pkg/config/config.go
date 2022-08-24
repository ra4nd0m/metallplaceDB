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
	HttpHost   string
	ChartHost  string
	ChartPort  int
}

func LoadConfig() (Config, error) {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file")
	}

	DbPort, _ := strconv.Atoi(os.Getenv("DB_PORT"))
	ChartPort, _ := strconv.Atoi(os.Getenv("CHART_PORT"))
	config := Config{
		DBHost:     os.Getenv("DB_HOST"),
		DBPort:     DbPort,
		DBUser:     os.Getenv("DB_USER"),
		DBPassword: os.Getenv("DB_PASSWORD"),
		DBName:     os.Getenv("DB_NAME"),
		HttpPort:   os.Getenv("HTTP_PORT"),
		HttpHost:   os.Getenv("HTTP_HOST"),
		ChartHost:  os.Getenv("CHART_HOST"),
		ChartPort:  ChartPort,
	}

	log.Printf("config: %#v\n", config)
	return config, nil
}
