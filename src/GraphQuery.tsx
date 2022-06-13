import React, { useEffect, useRef, useState } from "react"
import { useLazyWriteCypher, useReadCypher } from "use-neo4j"
import CytoscapeComponent from 'react-cytoscapejs';
import { Core } from "cytoscape";

interface Node {
    data: { id: string, label: string }/*, position: { x: number, y: number }*/
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [createPerson, createPersonResponse] = useLazyWriteCypher(
        createPersonQuery
    )

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [nodes, setNodes] = useState<Array<Node>>(new Array<Node>());
    const [edges, setEdges] = useState<Array<Edge>>(new Array<Edge>());



    useEffect(() => {
        if (test.records) {
            let ns: Array<Node> = new Array<Node>();
            //console.log(test.records.length)
            //console.log(test.records)
            for (let i = 0; i < test.records.length; i++) {
                let n: Node = { data: { id: test.records[i].get('m').identity.low, label: test.records[i].get('m').properties.name },/* position: { x: i * 100 + 100, y: 100 } */ }
                // console.log("rec" + test.records[i].get('m'))
                //console.log(" n:" + n)
                ns = [...ns, n];

            }

            // console.log(nodes)
            setNodes(ns)
        }
        //console.log(first?.get('m'))
        // setNodes([...nodes, n])
        //console.log(test.records)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (getRell.records) {
            //console.log(getRell.result)
            let ns: Array<Edge> = new Array<Edge>();
            for (let i = 0; i < getRell.records.length; i++) {
                let n: Edge = { data: { source: getRell.records[i].get('r').start.low, target: getRell.records[i].get('r').end.low, label: getRell.records[i].get('r').type } }
                // console.log("rec" + test.records[i].get('m'))
                //console.log(" n:" + n)
                ns = [...ns, n];
                //console.log(ns)
            }
            setEdges(ns);
            // console.log(edges)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [test.loading, getRell.loading])

    // .on('click', 'node', (e: any) => {
    //     const node = e.target;
    //     const ref = node.popperRef();

    //   });
    //const cy : Cy.core = null
    //const [cyi, setCyi] = useState<Core>()
    const cyRef = useRef<Core>(null);
    useEffect(() => {
        if (cyRef.current) {
          /*cyRef.current.on("tap", "node", (e) => {
            console.log("AAAAAA");
          });*/
          cyRef.current.on('click', 'node', (e: any) => {
            const node = e.target;
            //const ref = node.popperRef();
            console.log(node._private.data)
            //alert("lilly ' (" + node.data("name") + ")");
        });
        }
      },[]);
    //cyi && cyi.on('click', 'node', (e: any) => {
        //const node = e.target;
        //const ref = node.popperRef();
        //console.log(node._private.data)
        //alert("lilly ' (" + node.data("name") + ")");
   // });

    return (
        <div>
            {/* {loading &&
                <div>Carregando</div>
            } */}
            { }
            {/* {first?.get('m').properties.name} */}
            <div className="form">
                <h4>Criar Pessoa</h4>
                <label>Nome</label>
                <input type="text" value={personName} onChange={(e) => {
                    setPersonName(e.target.value)
                }} /><br />
                <button onClick={(e) => {
                    e.preventDefault()
                    createPerson({ name: personName })
                        .then(res => {
                            //res && setConfirmation(`Node updated at ${res.records[0].get('updatedAt').toString()}`)
                            res && console.log(res.records[0].get('p').properties.name)
                            test.run();
                            setPersonName("")
                        })
                        .catch(/*e => setError(e)*/)
                }}>enviar</button>
            </div>
            <CytoscapeComponent
                cy={(cy) => {
                    /* this.cy = cy*/
                    //setCyi(cy);
                    cyRef.current = cy
                }}
                elements={
                    CytoscapeComponent.normalizeElements({
                        nodes: nodes,
                        edges: edges
                    })
                }
                style={{ margin: "10px 20px 10px 20px", height: '600px', boxShadow: "2px 2px 6px 4px #ddd", backgroundColor: "#dfdfdf" }}
                pan={{ x: 200, y: 200 }}

                // layout={{
                //     name: 'circle',
                //     fit: true,
                //     padding: 30,
                //     boundingBox: undefined,
                //     avoidOverlap: true,
                //     nodeDimensionsIncludeLabels: false,
                //     spacingFactor: undefined,
                //     radius: undefined,
                //     startAngle: 3 / 2 * Math.PI,
                //     sweep: undefined,
                //     clockwise: true,
                //     sort: undefined,
                //     animate: true,
                //     animationDuration: 1000,
                //     animationEasing: undefined,
                //     animateFilter: function (node, i) { return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
                //     ready: undefined,
                //     stop: undefined,
                //     transform: function (node, position) { return position; }

                // }}
                layout={{
                    name: 'cose',

                    // Called on `layoutready`
                    //ready: function () { },
                    //stop: function () { },

                    // Whether to animate while running the layout
                    // true : Animate continuously as the layout is running
                    // false : Just show the end result
                    // 'end' : Animate with the end result, from the initial positions to the end positions
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
                            //"text-outline-color": "#555",
                            //"text-outline-width": "2px",
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
                    //   {
                    //     selector: "label",
                    //     style: {
                    //       color: "white",
                    //       //width: 30,
                    //       //height: 30,
                    //       //fontSize: 30
                    //       // shape: "rectangle"
                    //     }
                    //   },
                    {
                        selector: "edge",
                        style: {
                            'label': 'data(label)', // maps to data.label
                            width: 3,
                            // "line-color": "#6774cb",
                            "line-color": "#AAD8FF",
                            "target-arrow-color": "#6774cb",
                            "target-arrow-shape": "triangle",
                            "curve-style": "bezier"
                        }
                    }

                ]}
            />
        </div>
    )
}
export default GraphQuery