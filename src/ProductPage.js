// Product page shows:
// Some statistics
// - volume of migrations from / to (net migration)
// - average length of time to migration from / to (gather data)
// - average number of engineers in migration (gather data)
// - average cost of migration from / to (based on time * number of engineers * average salary)
// A D3 line graph showing the migrations to and from over time
// A table showing the migrations to and from
import DataService from "./services/data";
import { Link, useParams } from "react-router-dom";
import { MigrationsTable } from "./GraphPage";

const ProductPage = () => {
    const { productId } = useParams();
    const data = DataService({
        activeGroups: null,
        searchQuery: '',
        allGroups: null,
        lastMigration: 2023,
    });
    let productMap = {}
    data.nodes.forEach(node => {
        productMap[node.id] = node
    })
    // handle not found
    if (!(productId in productMap)) {
        return (
            <div className="container mx-auto">
            <div className="grid grid-cols-12 gap-2">
                <h2 className="text-4xl font-extrabold text-left dark:text-white">404</h2>
            </div>
            </div>
        )
    }

    document.title = `Migrations | ${productId}`

    let links = {
        'from': [],
        'to': []
    }
    let migrationStats = {
        'from': {
            'totalTime': 0,
            'totalEngineers': 0,
            'totalCost': 0,
            'totalComments': 0,
            'totalPoints': 0,
        },
        'to': {
            'totalTime': 0,
            'totalEngineers': 0,
            'totalCost': 0,
            'totalComments': 0,
            'totalPoints': 0,
        }
    }
    data.links.forEach((link) => {
        if (link.source == productId) {
            links['from'].push(link)
            // migrationStats['from']['avgTime'] += link.value
            // migrationStats['from']['avgEngineers'] += link.points
            migrationStats['from']['totalPoints'] += link.points
            migrationStats['from']['totalComments'] += link.num_comments
        } else if (link.target == productId) {
            links['to'].push(link)
            // migrationStats['to']['avgTime'] += link.value
            // migrationStats['to']['avgEngineers'] += link.points
            migrationStats['to']['totalPoints'] += link.points
            migrationStats['to']['totalComments'] += link.num_comments
        }
    })


    return (
        <div className="container mx-auto text-left">
            <h2 className="text-4xl mb-2 font-extrabold dark:text-white">{productId}</h2>
            <p className="mb-2 dark:text-white">Statistics and raw data on migrations to and from {productId}. Read how long previous migrations took and where people migrated to/from.</p>
            <div className="text-left statistics">
                <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Statistics:</h3>
                <p className="mb-2 space-y-1 text-gray-900 list-disc list-inside dark:text-gray-400">
                    In our dataset there were <b>{links['to'].length}</b> migrations <i>to</i> {productId} and <b>{links['from'].length}</b> migrations <i>away from</i> {productId} (net migration: <b>{links['to'].length - links['from'].length}</b>).
                </p>
                {/* <p className="mb-2 space-y-1 text-gray-900 list-disc list-inside dark:text-gray-400">
                    The average migration to {productId} took <b>{'3 months'}</b> and involved <b>{'3'}</b> engineers, costing roughly <b>{'$100,000'}</b> total.
                    Meanwhile, a typical migration away from {productId} took <b>{'6 months'}</b> and involved <b>{'5'}</b> engineers, costing roughly <b>{'$200,000'}</b> total.
                </p>
                <p className="mb-2 space-y-1 text-gray-900 list-disc list-inside dark:text-gray-400">
                    The longest migration to {productId} took <b>{'12 months'}</b> and involved <b>{'10'}</b> engineers, costing roughly <b>{'$500,000'}</b> total.
                    Meanwhile, the longest migration away from {productId} took <b>{'24 months'}</b> and involved <b>{'20'}</b> engineers, costing roughly <b>{'$1,000,000'}</b> total.
                </p> */}
                <p className="mb-2 space-y-1 text-gray-900 list-disc list-inside dark:text-gray-400">
                    On Hacker News, migrations to {productId} received an average of <b>{Math.floor(migrationStats['to']['totalComments'] / links['to'].length) || 0}</b> comments and <b>{Math.floor(migrationStats['to']['totalPoints'] / links['to'].length) || 0}</b> points.
                    Meanwhile, migrations away from {productId} received an average of <b>{Math.floor(migrationStats['from']['totalComments'] / links['from'].length) || 0}</b> comments and <b>{Math.floor(migrationStats['from']['totalPoints'] / links['from'].length) || 0}</b> points.
                </p>

            </div>

            <p className="mb-2 space-y-1 text-gray-900 list-disc list-inside dark:text-gray-400">
                Improve these statistics! <Link to="https://ixybtynp6db.typeform.com/to/KSZKLuJE" className="text-blue-600 dark:text-blue-500 hover:underline">Add a migration</Link> to improve their accuracy.
            </p>

            <MigrationsTable data={{links: links['to'].concat(links['from'])}} title={`Migrations to ${productId}`}/>
        </div>
    )

}

export default ProductPage