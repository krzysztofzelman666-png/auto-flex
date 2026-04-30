"use client";

import { use } from "react";

export default function EdytujAuto({ params }) {
  const { id } = use(params);
  return <div>Edytuję auto o id: {id}</div>
}