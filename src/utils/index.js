import database from "@/utils/database"
import electronAPI from "@/utils/electronAPI"
import parsingXLSX from "@/utils/parsingXLSX"

export default {
    ...database,
    ...electronAPI,
    ...parsingXLSX
}
