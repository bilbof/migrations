let data = require('../migrations.json');

const linksMap = new Map();
const linkTargetMap = new Map();
const nodeGroups = new Map();
data.nodes.forEach(node => {
    nodeGroups.set(node.id, node.group);
})
data.links.forEach(link => {
    const key = `${link.source},${link.target}`;
    linksMap.set(key, linksMap.get(key) + 1 || 1);
    linkTargetMap.set(link.target, linkTargetMap.get(link.target) + 1 || 1);
});

const filteredData = (dataset, linkPredicate) => {
    let links = dataset.links.filter(linkPredicate);
    let nodeSet = new Set();
    links.forEach(link => {
        nodeSet.add(link.source);
        nodeSet.add(link.target);
    });
    let nodes = dataset.nodes.filter(node => nodeSet.has(node.id))
    return { nodes, links };
}

const groups = [
    'programming',
    'tool',
    'database',
    'infrastructure',
    'software',
    'writing',
    'place',
    'finance',
    'mobile',
    'library',
].sort()

const DataService = ({
    activeGroups = null,
    searchQuery = '',
    allGroups = null,
    lastMigration = 2023,
}) => {
    if (!allGroups) {
        allGroups = groups
    }
    if (!activeGroups) {
        activeGroups = allGroups
    }
    const activeGroupIndexes = activeGroups.map(group => allGroups.indexOf(group));
    const filters = (link) => {
        return parseInt(link.value) <= lastMigration && (activeGroupIndexes.includes(nodeGroups.get(link.source)) || activeGroupIndexes.includes(nodeGroups.get(link.target)));
    }
    let dataToRender = filteredData(data, filters);
    if (searchQuery != '') {
        // Supported search syntax:
        // - keyword => search for keyword substring in source or target
        // - "keyword" => search for exact match in source or target
        // - keyword1, keyword2 => search for keyword1 OR keyword2 in source or target
        // - keyword1, "keyword2" => search for keyword1 substring AND keyword2 exact match in source or target

        const isSubstring = (str, substr) => {
            return str.toLowerCase().includes(substr.toLowerCase())
        }
        const isExactMatch = (str, substr) => {
            return str.toLowerCase() == substr.toLowerCase()
        }
        const searchTerms = searchQuery.split(',').map(term => term.trim()).filter(term => term != '')
        const searchTermsExact = searchTerms.filter(term => term.startsWith('"') && term.endsWith('"')).map(term => term.substring(1, term.length - 1))
        const searchTermsSubstring = searchTerms.filter(term => !term.startsWith('"') || !term.endsWith('"'))

        dataToRender = filteredData(dataToRender, (link) => {
            return searchTermsExact.some(term => {
                if (isExactMatch(link.source, term) || isExactMatch(link.target, term)) {
                    return true
                }
            }) ||
            searchTermsSubstring.some(term => {
                if (isSubstring(link.source, term) || isSubstring(link.target, term)) {
                    return true
                }
            })
        })
    }

    // Add a from particle count to each link
    dataToRender.links.forEach(link => {
        link.fromCount = linksMap.get(`${link.source},${link.target}`) || 0;
    })

    return dataToRender
}

export default DataService;