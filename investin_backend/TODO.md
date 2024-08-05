For every startup/investor update and delete route add a middleware which check if a investorCompany/startup  belongs to that particular startup/investor id only .. id is stored in  



# Implement Pagination Like this

The `skip` function in MongoDB is indeed used to skip over a specified number of documents and return the rest. While it's a common way to implement pagination, it can be inefficient for large collections as it has to iterate through the documents to reach the offset.

An alternative and more efficient way to implement pagination is by using the `_id` field. This approach is often referred to as cursor-based pagination or keyset pagination. It involves keeping track of the last seen document's `_id` and using it as a starting point for the next page of results. This method is generally faster and more efficient for large datasets.

Here's how you can implement cursor-based pagination for your `getAllInvestors` function:

1. Modify your request to include a `lastId` parameter.
2. Use the `lastId` parameter to find documents that come after the specified `_id`.

Here is an example:

```javascript
const getAllInvestors = async (req, res) => {
    try {
        console.log("Debug: Fetching all investors with pagination");
        
        const { page = 1, limit = 10, lastId } = req.query;
        const limitNumber = parseInt(limit);

        // Build the query to find investors
        let query = {};
        if (lastId) {
            query = { _id: { $gt: lastId } };
        }

        // Fetch the investors
        const investors = await Investor.find(query)
            .limit(limitNumber)
            .sort({ _id: 1 }); // Ensure the results are sorted by _id

        // Get the total count of documents
        const total = await Investor.countDocuments({});

        return res.status(200).json({
            total,
            limit: limitNumber,
            data: investors,
            lastId: investors.length ? investors[investors.length - 1]._id : null
        });
    } catch (error) {
        console.log("Debug: An error occurred", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = { getAllInvestors };
```

### Explanation:

1. **Query Parameter**: The function now accepts a `lastId` query parameter. This should be the `_id` of the last document from the previous page.
2. **Query**: If `lastId` is provided, it adds a condition to the query to fetch documents with an `_id` greater than `lastId`.
3. **Sorting**: The results are sorted by `_id` in ascending order to ensure proper pagination.
4. **Response**: The response includes a `lastId` field, which is the `_id` of the last document in the current page. This `lastId` should be used for the next page request.

### Usage:

- **Initial Request**: `/investors?page=1&limit=10`
- **Subsequent Requests**: `/investors?limit=10&lastId=<last_id_of_previous_page>`

This way, you efficiently fetch the next set of documents without iterating through all previous records, making the pagination process much faster for large datasets.