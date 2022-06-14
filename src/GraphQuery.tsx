import React, { useEffect, useMemo, useState } from "react"
import { useLazyWriteCypher, useReadCypher, useWriteCypher } from "use-neo4j"
import CytoscapeComponent from 'react-cytoscapejs';
import { Core } from "cytoscape";

interface Node {
    data: { id: string, label: string, type: string }/*, position: { x: number, y: number }*/
}
interface Edge {
    data: { source: string, target: string, label: string }
}
const GraphQuery = () => {
    // const query = `MATCH (m:Person {name: $name}) RETURN m`
    //const params = { name: 'Cacilde' }

    //const { loading, first } = useReadCypher(query, params)
    //const test = useReadCypher("MATCH (m:Person ) RETURN m")
    const test = useReadCypher("MATCH (m) RETURN m limit 100")

    const getRell = useReadCypher("Match (n)-[r]->(m) Return r")

    const [personName, setPersonName] = useState("");
    const createPersonQuery = "CREATE (p:Person {name: $name}) RETURN p"
    const [jobName, setJobName] = useState("");
    const createJobQuery = "CREATE (p:Job {name: $name}) RETURN p"

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [createPerson, createPersonResponse] = useLazyWriteCypher(
        createPersonQuery
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [createJob, createJobResponse] = useLazyWriteCypher(
        createJobQuery
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [deleteAllNodes, deleteResponse] = useLazyWriteCypher(
        "MATCH (n) DETACH  DELETE n"
    )
    //N RODA
    const [createRellQuery, setCreateRellQuery] = useState("match (p) where id(p) = 0 return p")

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const createRelationshipResponse = useWriteCypher(
        createRellQuery
    )

    const [createRellQueryJob, setCreateRellQueryJob] = useState("match (p) where id(p) = 0 return p")

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const createRelationshipJobResponse = useWriteCypher(
        createRellQueryJob
    )

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [nodes, setNodes] = useState<Array<Node>>(new Array<Node>());
    const [edges, setEdges] = useState<Array<Edge>>(new Array<Edge>());

    const [selectedNode, setSelectedNode] = useState<Node>();

    const [relObj1, setRelobj1] = useState<Node>()
    const [relObj2, setRelobj2] = useState<Node>()
    //const [rellType, setRellType] = useState<string>("")



    useEffect(() => {
        if (test.records) {
            let ns: Array<Node> = new Array<Node>();

            for (let i = 0; i < test.records.length; i++) {
                let n: Node = { data: { id: test.records[i].get('m').identity.low, label: test.records[i].get('m').properties.name, type: test.records[i].get('m').labels[0] },/* position: { x: i * 100 + 100, y: 100 } */ }
                //console.log(test.records[i].get('m'))
                ns = [...ns, n];

            }
            setNodes(ns)
        }
        if (getRell.records) {

            let ns: Array<Edge> = new Array<Edge>();
            for (let i = 0; i < getRell.records.length; i++) {
                let n: Edge = { data: { source: getRell.records[i].get('r').start.low, target: getRell.records[i].get('r').end.low, label: getRell.records[i].get('r').type } }

                ns = [...ns, n];
            }
            setEdges(ns);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [test.loading, getRell.loading])

    const [usedCy, setUsedCy] = useState<Core>();

    //const cyRef = React.useRef<Core>(null);
    useEffect(() => {

        if (usedCy) {

            usedCy.on('click', 'node', (e: any) => {
                e.preventDefault()
                const node = e.target;
                console.log(node._private.data)

                let n: Node = { data: { id: node._private.data.id, label: node._private.data.label, type: node._private.data.type },/* position: { x: i * 100 + 100, y: 100 } */ }
                setSelectedNode(n)

            });
        }
    }, [usedCy]);
    useEffect(() => {
        createRelationshipResponse.run({ createRellQuery })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createRellQuery])
    useEffect(() => {
        createRelationshipJobResponse.run({ createRellQueryJob })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createRellQueryJob])
    const Graph = useMemo(() => {
        return (
            <CytoscapeComponent
                cy={(cy) => {
                    /* this.cy = cy*/
                    //setCyi(cy);
                    //cyRef.current = cy
                    setUsedCy(cy)
                }}
                elements={
                    CytoscapeComponent.normalizeElements({
                        nodes: nodes,
                        edges: edges
                    })
                }
                style={{ margin: "10px 20px 10px 20px", height: "600px", boxShadow: "2px 2px 6px 4px #ddd", backgroundColor: "#dfdfdf" }}
                pan={{ x: 200, y: 200 }}


                layout={{
                    name: 'cose',
                    ready: function () { },
                    stop: function () { },
                    animate: true,
                    animationEasing: undefined,
                    animationDuration: 10000,
                    animateFilter: function (node, i) { return true; },
                    refresh: 20,
                    fit: true,
                    padding: 30,
                    boundingBox: undefined,
                    nodeDimensionsIncludeLabels: false,
                    randomize: false,
                    componentSpacing: 70,
                    nodeRepulsion: function (node) { return 2048; },
                    nodeOverlap: 4,
                    idealEdgeLength: function (edge) { return 55; },
                    edgeElasticity: function (edge) { return 100; },
                    //nestingFactor: 1.2,
                    nestingFactor: 6,
                    gravity: 75,
                    numIter: 1000,
                    initialTemp: 1000,
                    coolingFactor: 0.95,
                    minTemp: 1.0

                }}
                stylesheet={[
                    {
                        selector: 'node',
                        style: {
                            //backgroundColor: "#555",
                            width: 60,
                            height: 60,
                            label: "data(label)",
                            "text-valign": "center",
                            "text-halign": "center",
                            "text-outline-color": "#555",
                            "text-outline-width": "1px",
                            "overlay-padding": "6px",
                            //"z-index": "10"
                            color: "white"
                        }
                    },
                    {
                        selector: "node:selected",
                        style: {
                            //"border-width": "6px",
                            //"border-color": "#AAD8FF",
                            //"border-opacity": "0.5",
                            "background-color": "#77828C",
                            //"text-outline-color": "#77828C"
                        }
                    },


                    {
                        selector: "edge",
                        style: {
                            'label': 'data(label)', // maps to data.label
                            width: 3,
                            // "line-color": "#6774cb",
                            "line-color": "#AAD8FF",
                            "target-arrow-color": "#6774cb",
                            "target-arrow-shape": "triangle",
                            "curve-style": "bezier",
                            "text-outline-color": "#555",
                            "text-outline-width": "1px",
                            color: "white",
                            "font-size": "12px"
                        }
                    },
                    {
                        selector: 'node[type="Job"]',
                        style: {
                            //'shape': 'square',
                            'background-color': '#dd7777'
                        }
                    }

                ]}
            />
        )

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes, edges])


    return (
        <div style={{ margin: "10px 20px 10px 20px" }}>
            <div style={{width:"100%", textAlign:"center"}}>
                <h1>NEO4J ReactJs</h1>

            </div>
            <div style={{ display: "inline-block", width: "25%", float: "left" }}>
                <h4>Criar Pessoa</h4>
                <label>Nome</label>
                <input type="text" value={personName} onChange={(e) => {
                    setPersonName(e.target.value)
                }} />
                <button onClick={(e) => {
                    e.preventDefault()

                    createPerson({ name: personName })
                        .then(res => {
                            //res && setConfirmation(`Node updated at ${res.records[0].get('updatedAt').toString()}`)
                            res && console.log(res.records[0].get('p').properties.name)
                            test.run();
                            setPersonName("")
                        })
                        .catch(e => console.log(e))
                }}>enviar</button>
                <h4>Criar Trabalho</h4>
                <label>Nome</label>
                <input type="text" value={jobName} onChange={(e) => {
                    setJobName(e.target.value)
                }} />
                <button onClick={(e) => {
                    e.preventDefault()

                    createJob({ name: jobName })
                        .then(res => {
                            //res && setConfirmation(`Node updated at ${res.records[0].get('updatedAt').toString()}`)
                            res && console.log(res.records[0].get('p').properties.name)
                            test.run();
                            setJobName("")
                        })
                        .catch(e => console.log(e))
                }}>enviar</button>

                <h4>Criar relação</h4>
                Pessoa Selecionada : {selectedNode && selectedNode.data.label} <br />
                <button onClick={
                    (e) => {
                        setRelobj1(selectedNode)
                    }
                }>Colocar na query como nó 1</button>
                <button onClick={
                    (e) => {
                        setRelobj2(selectedNode)
                    }
                }>Colocar na query como nó 2</button><br />
                <hr />
                &#40;p:{relObj1 && relObj1.data.label}&#41;- &#91;
                r:{/*<input type="text" value={rellType} onChange={(e) => {
                    setRellType(e.target.value)

                }}></input> */}
                meet
                &#93; -&gt; &#40;p2:{relObj2 && relObj2.data.label}&#41;<br />

                <button
                    onClick={(e) => {
                        setCreateRellQuery(`match (p:Person) where id(p) = ${relObj1?.data.id} match (p2:Person) where id(p2) = ${relObj2?.data.id} create (p)-[r:meet]->(p2) return p`)
                        console.log(relObj1?.data);
                        console.log(relObj2?.data);
                        if (relObj1?.data.id !== undefined && relObj2?.data.id !== undefined) {
                            let ns: Array<Edge> = new Array<Edge>();

                            let n: Edge = { data: { source: relObj1?.data.id, target: relObj2?.data.id, label: "meet" } }
                            ns = [...edges, n]
                            setEdges(ns)
                        }

                    }}
                >Criar Relacionamento "Conhece"</button>

                <hr />
                &#40;p:{relObj1 && relObj1.data.label}&#41;- &#91;
                r:workIn
                &#93; -&gt; &#40;p2:{relObj2 && relObj2.data.label}&#41;<br />
                <button
                    onClick={(e) => {
                        setCreateRellQueryJob(`match (p) where id(p) = ${relObj1?.data.id} match (p2) where id(p2) = ${relObj2?.data.id} create (p)-[r:workIn]->(p2) return p`)
                        console.log(relObj1?.data);
                        console.log(relObj2?.data);
                        if (relObj1?.data.id !== undefined && relObj2?.data.id !== undefined) {
                            let ns: Array<Edge> = new Array<Edge>();

                            let n: Edge = { data: { source: relObj1?.data.id, target: relObj2?.data.id, label: "workIn" } }
                            ns = [...edges, n]
                            setEdges(ns)
                        }

                    }}
                >Criar Relacionamento "Trabalha"</button>
                <hr />
                <button onClick={() => window.location.reload()}>Recarregar Tabela!</button>
                <button style={{ backgroundColor: "#FF6655", color: "white", border: "none", }} onClick={(e) => {
                    deleteAllNodes()
                        .then(res => {
                            //res && setConfirmation(`Node updated at ${res.records[0].get('updatedAt').toString()}`)
                            //res && console.log(res.records[0].get('p').properties.name)
                            test.run();
                            window.location.reload()
                        })
                        .catch(e => console.log(e))
                }
                }>Apagar Tudo do banco</button>
            </div>
            <div style={{ display: "inline-block", width: "70%", float: "right" }}>
                {Graph}
            </div>
        </div>
    )
}
export default GraphQuery