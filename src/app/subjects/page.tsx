// page for selecting a subject from the list of subjects available from the given exam board.
// currently just a placeholder linking to CS, but will feature selection of exam board, level, and subject.

import React from 'react';
import Link from 'next/link';

export default function Subjects() {
    return (
            <nav>
                <ul className="list-none m-10 p-0 flex">
                <li>
                    <Link href="/subjects/1/">Computer Science A/AS</Link>
                </li>
                </ul>
            </nav>
    );
}

