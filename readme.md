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

-   **/api/fetch*
	* If no query param is provided, returns all links paginated and sorted by date.
	* If a query param is provided, returns paginated results text matched for name, author, and tag sorted by date.
	* Query params:
		* **page** - Results page number
		* **query** - Search term
	* Example:

			api/fetch?query=principal&page=2

-   **/api/delete/:\_id**
	* Deletes a link entry.
	* Returns status 200 upon successful deletion.
	* Example: 
		
			api/delete/1234

-   **/api/fetch/tags**
	* Returns an unsorted array of all unique tags.

### Post

-   **/api/update/:id**
	* Updates a link entry.
	* Pushes new date into updated_at array.
	* Post body:
		* any valid field with new value
		* Example:

				{ name: "new name" }
-   **/api/create**
	* Creates a new link entry using Link schema.
	* Example:

			{
				author: "Dave",
				name: "Google",
				url: "google.com",
				tags: [ "Search engine" ]
			}
