# Prinboard API

A headless API to get, post, update, and delete links.

## Root url

https://prinboard-api.herokuapp.com/

## Schema

###  Link

		{
			author: { type: String, required: true }
			created_at: { type: Date, default: Date.now }
			name: { type: String, required: true }
			tags: { type: [String], default: [] }
			updated_at: { type: [Date], default: [] }
			url: { type: String, required: true }
		}

## Endpoints

### Get

-   **/api/search/**
	* Search for links. Text match for name, author, and tag.
	* Query params:
		* page - Results page number
		* query - Search term
	* Example:

			api/search?query=principal&page=2

-   **/api/delete/:\_id**
	* Deletes a link entry
	* Example: 
		
			api/delete/1234

-   **/api/tags**
	* returns an array of all unique tags

### Post

-   **/api/update**
	* Updates a link entry.
	* Pushes new date into updated_at array
	* Post body:
		* \_id (required)
		* any field with new value
		* example:
	* Example:

			{ _id: 1234, name: "new name" }
-   **/api/new**
	* Creates a new link entry using Link schema
	* Example:

			{
				author: "Dave",
				name: "Google",
				url: "google.com",
				tags: [ "Search engine" ]
			}
