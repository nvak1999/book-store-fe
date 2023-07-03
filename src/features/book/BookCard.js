import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";

export default function BookCard() {
  return (
    <Card
      sx={{
        Width: 300,
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        alignSelf: "center",
        m: 3,
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          image="https://imgv2-2-f.scribdassets.com/img/word_document/487681026/original/432x574/66b6c930d0/1648771671?v=1"
          alt="Green Iguana"
        />
      </CardActionArea>
    </Card>
  );
}
