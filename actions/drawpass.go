package actions

import (
	"anim8/models"
	"fmt"
	"github.com/gobuffalo/buffalo"
)

func DrawpassHandler(c buffalo.Context) error {
	slug := c.Param("sgroup_slug")

	if slug == "new" {
		c.Set("sid", slug)
	} else {
		c.Set("sid", sessionGroupId(slug))
	}

	return c.Render(200, r.HTML("drawpass.html"))
}

// TODO: handle error for missing session group
func sessionGroupId(slug string) int {
	sgroups := models.SessionGroups{}

	sqs := fmt.Sprintf("slug = '%s'", slug)
	query := models.DB.Where(sqs)
	query.All(&sgroups)

	if len(sgroups) > 0 {
		return sgroups[0].ID
	} else {
		return 0
	}
}
