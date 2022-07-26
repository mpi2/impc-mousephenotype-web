import { useState } from "react";
import { Container } from "react-bootstrap";
import Card from "../../components/Card";
import Search from "../../components/Search";
import Unidimensional from "../../components/Data/Unidemensional";
import Viability from "../../components/Data/Viability";
import Categorical from "../../components/Data/Categorical";
import TimeSeries from "../../components/Data/TimeSeries";
import Embryo from "../../components/Data/Embryo";
import Histopathology from "../../components/Data/Histopathology";

const Charts = () => {
  const [mode, setMode] = useState("Unidimensional");
  const getPage = () => {
    switch (mode) {
      case "Unidimensional":
        return <Unidimensional />;
      case "Categorical":
        return <Categorical />;
      case "Viability":
        return <Viability />;
      case "Time series":
        return <TimeSeries />;
      case "Embryo":
        return <Embryo />;
      case "Histopathology":
        return <Histopathology />;

      default:
        return null;
    }
  };
  return (
    <>
      <Search />
      <Container className="page">
        {getPage()}
        <Card>
          <p>Current mode: {mode}</p>
          <div style={{ display: "flex" }}>
            <button
              onClick={() => {
                setMode("Unidimensional");
              }}
            >
              Unidimensional
            </button>
            <button
              onClick={() => {
                setMode("Categorical");
              }}
            >
              Categorical
            </button>
            <button
              onClick={() => {
                setMode("Viability");
              }}
            >
              Viability
            </button>
            <button
              onClick={() => {
                setMode("Time series");
              }}
            >
              Time series
            </button>
            <button
              onClick={() => {
                setMode("Embryo");
              }}
            >
              Embryo
            </button>
            <button
              onClick={() => {
                setMode("Histopathology");
              }}
            >
              Histopathology
            </button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default Charts;
