package config

import (
	"fmt"
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

	HttpPort string
	HttpHost string

	ChartHost string
	ChartPort int

	DocxgenHost string
	DocxgenPort int

	AuthKey []byte

	InternalHttpPort string

	SentryDSN string

	ModifierPort int
	ModifierHost string
}

func LoadConfig() (Config, error) {

	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file")
		panic(err)
	}

	DbPort, err := strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		return Config{}, fmt.Errorf("error loading db port: %w", err)
	}
	ChartPort, err := strconv.Atoi(os.Getenv("CHART_PORT"))
	if err != nil {
		return Config{}, fmt.Errorf("error loading chart port: %w", err)
	}
	DocxgenPort, err := strconv.Atoi(os.Getenv("DOCXGEN_PORT"))
	if err != nil {
		return Config{}, fmt.Errorf("error loading docxgen port: %w", err)
	}
	ModifierPort, err := strconv.Atoi(os.Getenv("MPLBASE_MODIFY_DOCX_PORT"))
	if err != nil {
		return Config{}, fmt.Errorf("error loading modifier port: %w", err)
	}
	config := Config{
		DBHost:           os.Getenv("DB_HOST"),
		DBPort:           DbPort,
		DBUser:           os.Getenv("DB_USER"),
		DBPassword:       os.Getenv("DB_PASSWORD"),
		DBName:           os.Getenv("DB_NAME"),
		HttpPort:         os.Getenv("HTTP_PORT"),
		HttpHost:         os.Getenv("HTTP_HOST"),
		ChartHost:        os.Getenv("CHART_HOST"),
		ChartPort:        ChartPort,
		DocxgenHost:      os.Getenv("DOCXGEN_HOST"),
		DocxgenPort:      DocxgenPort,
		AuthKey:          []byte(os.Getenv("MPLBASE_AUTH_KEY")),
		InternalHttpPort: os.Getenv("MPLBASE_INTERNAL_HTTP_PORT"),
		SentryDSN:        os.Getenv("MPLBASE_SENTRY_DSN"),
		ModifierHost:     os.Getenv("MPLBASE_MODIFIER_HOST"),
		ModifierPort:     ModifierPort,
	}

	log.Printf("config: %#v\n", config)
	return config, nil
}
