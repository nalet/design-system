// the glossary as data: what the hover explanations read, and what a tool or
// an agent can fetch in one request.
import { GLOSSARY } from '../data/glossary';

export function GET() {
  return new Response(JSON.stringify(GLOSSARY), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
