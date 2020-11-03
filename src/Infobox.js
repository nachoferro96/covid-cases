import React from "react";
import "./Infobox.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function Infobox({ title, cases, active, isRed, total, ...props }) {
  return (
    <div className="infoBox">
      <Card
        onClick={props.onClick}
        className={`infoBox ${active && "infoBox--selected"} ${
          isRed && "infoBox--red"
        }`}
      >
        <CardContent>
          <Typography className="infobox-title" color="textSecondary">
            {title}
          </Typography>
          <h2 className={`infoBox-cases ${!isRed && "infoBox-cases--green"}`}>
            {cases} <small>today</small>
          </h2>
          <Typography className="infobox-total">{total} total</Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Infobox;
