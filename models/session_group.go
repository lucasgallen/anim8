package models

import (
	"encoding/json"
	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"time"

  "fmt"
  "math/rand"
)

// SessionGroup model struct
type SessionGroup struct {
	ID          int         `json:"id" db:"id"`
	SharedImage SharedImage `json:"shared_image" has_one:"shared_image"`
	ImageReady  bool        `json:"image_ready" db:"image_ready"`
	Slug        string      `json:"slug" db:"slug"`
	CreatedAt   time.Time   `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at" db:"updated_at"`
}

// String is not required by pop and may be deleted
func (s SessionGroup) String() string {
	js, _ := json.Marshal(s)
	return string(js)
}

// SessionGroups is not required by pop and may be deleted
type SessionGroups []SessionGroup

// String is not required by pop and may be deleted
func (s SessionGroups) String() string {
	js, _ := json.Marshal(s)
	return string(js)
}

func (s *SessionGroup) BeforeCreate(tx *pop.Connection) error {
  s.Slug = hexSlug()

  return nil
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (s *SessionGroup) Validate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

// ValidateCreate gets run every time you call "pop.ValidateAndCreate" method.
// This method is not required and may be deleted.
func (s *SessionGroup) ValidateCreate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

// ValidateUpdate gets run every time you call "pop.ValidateAndUpdate" method.
// This method is not required and may be deleted.
func (s *SessionGroup) ValidateUpdate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

func hexSlug() string {
  utime := time.Now().Unix()
  randInt32 := rand.New(rand.NewSource(utime)).Int31()
  h := fmt.Sprintf("%x", randInt32)

  return h
}
