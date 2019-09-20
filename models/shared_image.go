package models

import (
	"encoding/json"
	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"time"
)

// SharedImage model struct
type SharedImage struct {
	ID             int           `json:"id" db:"id"`
	SessionGroupID int           `db:"session_group_id"`
	SessionGroup   *SessionGroup `belongs_to:"session_group"`
	Blob           []byte        `json:"blob" db:"blob"`
	CreatedAt      time.Time     `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time     `json:"updated_at" db:"updated_at"`
}

// String is not required by pop and may be deleted
func (s SharedImage) String() string {
	js, _ := json.Marshal(s)
	return string(js)
}

// SharedImages is not required by pop and may be deleted
type SharedImages []SharedImage

// String is not required by pop and may be deleted
func (s SharedImages) String() string {
	js, _ := json.Marshal(s)
	return string(js)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (s *SharedImage) Validate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

// ValidateCreate gets run every time you call "pop.ValidateAndCreate" method.
// This method is not required and may be deleted.
func (s *SharedImage) ValidateCreate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

// ValidateUpdate gets run every time you call "pop.ValidateAndUpdate" method.
// This method is not required and may be deleted.
func (s *SharedImage) ValidateUpdate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}
