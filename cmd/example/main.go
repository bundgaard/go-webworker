package main

import (
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"text/template"
)

func main() {

	fmt.Println("Webworker example")
	root := http.NewServeMux()
	apiV1 := http.NewServeMux()

	apiV1.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		log.Println("/ping")
		fmt.Fprint(w, "Pong")
	})

	root.Handle("/api/v1/", http.StripPrefix("/api/v1", apiV1))

	root.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir("static"))))

	root.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		tpls, err := template.New("index.html").ParseFiles(filepath.Join("public", "layout.html"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if err := tpls.Funcs(template.FuncMap{"dummy": func() string { return "dummy" }}).ExecuteTemplate(w, "layout", nil); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
	})

	fmt.Println("listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080", root))
}
