"use client"
import OutputView from "@/components/OutputItem";
import { OutputData } from "@/types";
import { useState, useEffect } from "react";
import SearchComponentCollection from "@/components/SearchComponentCollection";

interface Props {
    topics: string[];
    subject: number;
}

/**
 * The client-side component for the client-side components of the exam paper generator.
 * Consists of the search component collection and the exam paper header and the output area.
 */
const ExamGeneratorClientArea: React.FC<Props> = ({ topics, subject }) => {
    