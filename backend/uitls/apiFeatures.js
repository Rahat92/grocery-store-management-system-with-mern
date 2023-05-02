class ApiFeature {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr
    }
    filter(){
        let queryCopy = {...this.queryStr}
        const excludedFields = ['page, limit']
        excludedFields.map(field => delete Object(queryCopy)[field])
        queryCopy = JSON.parse(JSON.stringify(queryCopy).replace(/\b(lt|lte|gt|gte)\b/g, match => `$${match}`))
        this.query = this.query.find(queryCopy)
        return this
    }
}
module.exports = ApiFeature