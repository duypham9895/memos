package teststore

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/usememos/memos/api"
	"github.com/usememos/memos/store"
	"golang.org/x/crypto/bcrypt"
)

func TestUserStore(t *testing.T) {
	ctx := context.Background()
	store := NewTestingStore(ctx, t)
	user, err := createTestingHostUser(ctx, store)
	require.NoError(t, err)
	users, err := store.FindUserList(ctx, &api.UserFind{})
	require.NoError(t, err)
	require.Equal(t, 1, len(users))
	require.Equal(t, api.Host, users[0].Role)
	require.Equal(t, user, users[0])
	userPatchNickname := "test_nickname_2"
	userPatch := &api.UserPatch{
		ID:       user.ID,
		Nickname: &userPatchNickname,
	}
	user, err = store.PatchUser(ctx, userPatch)
	require.NoError(t, err)
	require.Equal(t, userPatchNickname, user.Nickname)
	err = store.DeleteUser(ctx, &api.UserDelete{
		ID: user.ID,
	})
	require.NoError(t, err)
	users, err = store.FindUserList(ctx, &api.UserFind{})
	require.NoError(t, err)
	require.Equal(t, 0, len(users))
}

func createTestingHostUser(ctx context.Context, store *store.Store) (*api.User, error) {
	userCreate := &api.UserCreate{
		Username: "test",
		Role:     api.Host,
		Email:    "test@test.com",
		Nickname: "test_nickname",
		Password: "test_password",
		OpenID:   "test_open_id",
	}
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(userCreate.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	userCreate.PasswordHash = string(passwordHash)
	user, err := store.CreateUser(ctx, userCreate)
	return user, err
}
