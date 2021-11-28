
import React, { useRef, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import Draggable from 'react-draggable';

const containerStyle = {
  position: "relative",
  display: "flex",
  justifyContent: "space-evenly",
  width: "800px",
  height: "600px",
  backgroundColor: "#aaa",
  margin: "0 auto"
}

const DraggableBox = (props) => {
  const updateXarrow = useXarrow();

  const onControlledDragStop = (e, position) => {
    props.updatePosOnStop(props.id, position);
  };

  return (
    <Draggable
      bounds={'#container'}
      onDrag={updateXarrow}
      onStop={(e, data) => { updateXarrow(); onControlledDragStop(e, data) }}
      position={{ x: props.position.x, y: props.position.y }}
    >
      <div id={props.id} style={{ opacity: props.visible ? 1 : 0 }} className="box">
        {props.id}
      </div>
    </Draggable>
  );
};

function DraggingLines() {
  const [Blocks, setBlocks] = useState([]);
  const [Lines, setLines] = useState([]);
  const [LineType, setLineType] = useState("grid");

  const containerRef = useRef(null);

  function createBlock() {
    const boxId = 'Block' + (Blocks.length + 1);

    const blocks = [...Blocks];
    const box = {
      id: boxId,
      position: { x: 0, y: 0 },
      visible: true
    }
    blocks.push(box);
    setBlocks(blocks);
  }

  function updatePosOnStop(id, position) {
    const blocks = [...Blocks];
    const elemToUpdate = blocks.find(b => b.id === id);
    elemToUpdate.position = { x: position.x, y: position.y };
    setBlocks(blocks);
  }

  function createConnection() {
    const lines = [...Lines];
    lines.push({ startElem: "Block1", endElem: "Block2" });
    setLines(lines);
  }

  function handleLineTypeChange(e) {
    setLineType(e.target.value);
  }

  function toggleBlock2Opacity() {
    const blocks = [...Blocks];
    const elemToUpdateIndex = blocks.findIndex(b => b.id === "Block2");
    blocks[elemToUpdateIndex].visible = !blocks[elemToUpdateIndex].visible;
    setBlocks(blocks);
  }

  return (
    <div className="DraggingLines" style={{ height: "100%" }}>
      <h1 style={{ margin: 0, textAlign: "center" }}>Draggables and Lines</h1>
      <header>
        <button onClick={() => createBlock()} disabled={Blocks.length > 1}>Create Blocks (max: 2)</button>
        {Lines.length ?
          <button onClick={() => setLines([])}>Remove Connection</button> :
          <button onClick={() => createConnection()}>Create Connection</button>
        }
        <button onClick={() => { setLines([]); setBlocks([]); }}>Reset All</button>
        <div style={{ marginLeft: 20, marginRight: 10 }}>
          <label htmlFor="lineType">Line Type: </label>
          <select name="lineType" id="lineType" value={LineType} onChange={handleLineTypeChange}>
            <option value="grid">grid</option>
            <option value="straight">straight</option>
            <option value="smooth">smooth</option>
          </select>
        </div>
        <div>
          <label htmlFor="visibility2">Toggle Block 2 opacity</label>
          <input type="checkbox" name="visibility2" id="visibility2" onChange={toggleBlock2Opacity} />
        </div>
      </header>
      <div id="container" ref={containerRef} style={containerStyle}>
        <Xwrapper>
          {Blocks.map(block => {
            return <DraggableBox
              updatePosOnStop={updatePosOnStop}
              position={block.position}
              key={block.id}
              id={block.id}
              visible={block.visible} />
          })}
          {Lines.map(line => {
            return <Xarrow
              key={line.startElem + "" + line.endElem}
              showHead={false}
              path={LineType}
              color="red"
              start={line.startElem}
              end={line.endElem} />
          })}
        </Xwrapper>
      </div>
    </div>
  );
}


export default DraggingLines;
