package api

const (
	// LocalStorage means the storage service is local file system.
	LocalStorage = -1
	// DatabaseStorage means the storage service is database.
	DatabaseStorage = 0
)

type StorageType string

const (
	StorageS3 StorageType = "S3"
)

type StorageConfig struct {
	S3Config *StorageS3Config `json:"s3Config"`
}

type StorageS3Config struct {
	EndPoint  string `json:"endPoint"`
	Path      string `json:"path"`
	Region    string `json:"region"`
	AccessKey string `json:"accessKey"`
	SecretKey string `json:"secretKey"`
	Bucket    string `json:"bucket"`
	URLPrefix string `json:"urlPrefix"`
	URLSuffix string `json:"urlSuffix"`
}

type Storage struct {
	ID     int            `json:"id"`
	Name   string         `json:"name"`
	Type   StorageType    `json:"type"`
	Config *StorageConfig `json:"config"`
}

type StorageCreate struct {
	Name   string         `json:"name"`
	Type   StorageType    `json:"type"`
	Config *StorageConfig `json:"config"`
}

type StoragePatch struct {
	ID     int            `json:"id"`
	Type   StorageType    `json:"type"`
	Name   *string        `json:"name"`
	Config *StorageConfig `json:"config"`
}

type StorageFind struct {
	ID *int `json:"id"`
}

type StorageDelete struct {
	ID int `json:"id"`
}
