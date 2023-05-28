package api

import "github.com/usememos/memos/server/profile"

type SystemStatus struct {
	Host    *User           `json:"host"`
	Profile profile.Profile `json:"profile"`
	DBSize  int64           `json:"dbSize"`

	// System settings
	// Allow sign up.
	AllowSignUp bool `json:"allowSignUp"`
	// Ignore upgrade
	IgnoreUpgrade bool `json:"ignoreUpgrade"`
	// Disable public memos.
	DisablePublicMemos bool `json:"disablePublicMemos"`
	// Max upload size.
	MaxUploadSizeMiB int `json:"maxUploadSizeMiB"`
	// Additional style.
	AdditionalStyle string `json:"additionalStyle"`
	// Additional script.
	AdditionalScript string `json:"additionalScript"`
	// Customized server profile, including server name and external url.
	CustomizedProfile CustomizedProfile `json:"customizedProfile"`
	// Storage service ID.
	StorageServiceID int `json:"storageServiceId"`
	// Local storage path.
	LocalStoragePath string `json:"localStoragePath"`
	// Memo display with updated timestamp.
	MemoDisplayWithUpdatedTs bool `json:"memoDisplayWithUpdatedTs"`
}
