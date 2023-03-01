type Appearance = "system" | "light" | "dark";

interface Setting {
  locale: Locale;
  appearance: Appearance;
  memoVisibility: Visibility;
  resourceVisibility: Visibility;
}

interface LocalSetting {
  enableFoldMemo: boolean;
  enableDoubleClickEditing: boolean;
}

interface UserLocaleSetting {
  key: "locale";
  value: Locale;
}

interface UserAppearanceSetting {
  key: "appearance";
  value: Appearance;
}

interface UserMemoVisibilitySetting {
  key: "memoVisibility";
  value: Visibility;
}

interface UserResourceVisibilitySetting {
  key: "resourceVisibility";
  value: Visibility;
}

type UserSetting = UserLocaleSetting | UserAppearanceSetting | UserMemoVisibilitySetting | UserResourceVisibilitySetting;

interface UserSettingUpsert {
  key: keyof Setting;
  value: string;
}
