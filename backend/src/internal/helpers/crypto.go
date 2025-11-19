package helpers

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/md5"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"io"
	"os"
)

// GetEncryptionKey returns the encryption key from environment or uses a default
func GetEncryptionKey() []byte {
	key := os.Getenv("PASSWORD_ENCRYPTION_KEY")
	if key == "" {
		// Default key - should be set in environment for production
		key = "mySecretKey123456789012345678901234" // 32 bytes for AES-256
	}
	// Ensure key is exactly 32 bytes for AES-256
	keyBytes := []byte(key)
	if len(keyBytes) < 32 {
		// Pad with zeros if shorter
		padded := make([]byte, 32)
		copy(padded, keyBytes)
		return padded
	}
	return keyBytes[:32]
}

// EncryptPassword encrypts a password using AES-256
func EncryptPassword(password string) (string, error) {
	key := GetEncryptionKey()
	
	// Create cipher block
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("failed to create cipher: %v", err)
	}

	// Create GCM
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("failed to create GCM: %v", err)
	}

	// Create nonce
	nonce := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", fmt.Errorf("failed to create nonce: %v", err)
	}

	// Encrypt
	ciphertext := gcm.Seal(nonce, nonce, []byte(password), nil)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// DecryptPassword decrypts an encrypted password
func DecryptPassword(encryptedPassword string) (string, error) {
	key := GetEncryptionKey()

	// Decode base64
	ciphertext, err := base64.StdEncoding.DecodeString(encryptedPassword)
	if err != nil {
		return "", fmt.Errorf("failed to decode base64: %v", err)
	}

	// Create cipher block
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("failed to create cipher: %v", err)
	}

	// Create GCM
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("failed to create GCM: %v", err)
	}

	// Extract nonce
	nonceSize := gcm.NonceSize()
	if len(ciphertext) < nonceSize {
		return "", fmt.Errorf("ciphertext too short")
	}

	nonce, ciphertext := ciphertext[:nonceSize], ciphertext[nonceSize:]

	// Decrypt
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", fmt.Errorf("failed to decrypt: %v", err)
	}

	return string(plaintext), nil
}

// IsBcryptHash checks if a string is a bcrypt hash
func IsBcryptHash(s string) bool {
	// Bcrypt hashes start with $2a$, $2b$, or $2y$ and are 60 characters long
	return len(s) == 60 && (s[:4] == "$2a$" || s[:4] == "$2b$" || s[:4] == "$2y$")
}

// HashPasswordMD5 hashes a password using MD5
func HashPasswordMD5(password string) string {
	hash := md5.Sum([]byte(password))
	return hex.EncodeToString(hash[:])
}

// VerifyPasswordMD5 verifies a password against an MD5 hash
func VerifyPasswordMD5(password, hash string) bool {
	hashedPassword := HashPasswordMD5(password)
	return hashedPassword == hash
}

// IsMD5Hash checks if a string is an MD5 hash (32 hex characters)
func IsMD5Hash(s string) bool {
	if len(s) != 32 {
		return false
	}
	// Check if all characters are hex
	for _, c := range s {
		if !((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F')) {
			return false
		}
	}
	return true
}

// EncodePasswordBase64 encodes a password using Base64
func EncodePasswordBase64(password string) string {
	return base64.StdEncoding.EncodeToString([]byte(password))
}

// DecodePasswordBase64 decodes a Base64 encoded password
func DecodePasswordBase64(encodedPassword string) (string, error) {
	decoded, err := base64.StdEncoding.DecodeString(encodedPassword)
	if err != nil {
		return "", fmt.Errorf("failed to decode base64: %v", err)
	}
	return string(decoded), nil
}

// IsBase64Encoded checks if a string is Base64 encoded
func IsBase64Encoded(s string) bool {
	_, err := base64.StdEncoding.DecodeString(s)
	return err == nil
}

