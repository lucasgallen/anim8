package actions

import "github.com/gobuffalo/buffalo"

func FlipbookHandler(c buffalo.Context) error {
	return c.Render(200, r.HTML("flipbook.html"))
}
