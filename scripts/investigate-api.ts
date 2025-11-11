/**
 * Script para investigar qué devuelve la API de LearnDash
 */
import { config } from 'dotenv';

config();

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://intranet.remax-titanium.com.ar/wp-json';
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME;
const WORDPRESS_PASSWORD = process.env.WORDPRESS_PASSWORD;

if (!WORDPRESS_USERNAME || !WORDPRESS_PASSWORD) {
  console.error('❌ Error: Debes configurar WORDPRESS_USERNAME y WORDPRESS_PASSWORD en .env');
  process.exit(1);
}

const authHeader = `Basic ${Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_PASSWORD}`).toString('base64')}`;

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = `${WORDPRESS_API_URL}${endpoint}`;
  console.log(`📡 Fetching: ${endpoint}`);

  const response = await fetch(url, {
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function investigate() {
  console.log('🔍 Investigando la API de LearnDash...\n');

  try {
    // Probar el endpoint de steps del curso
    console.log('1️⃣ Probando: /ldlms/v1/sfwd-courses/1274/steps');
    const courseSteps = await fetchAPI('/ldlms/v1/sfwd-courses/1274/steps');
    console.log('Tipo de respuesta:', typeof courseSteps);
    console.log('Es array?:', Array.isArray(courseSteps));
    console.log('Respuesta completa:');
    console.log(JSON.stringify(courseSteps, null, 2));
    console.log('\n');

    // Probar el endpoint alternativo
    console.log('2️⃣ Probando: /ldlms/v1/courses/1274');
    try {
      const course = await fetchAPI('/ldlms/v1/courses/1274');
      console.log('Respuesta del curso:');
      console.log(JSON.stringify(course, null, 2));
    } catch (error) {
      console.log('❌ Este endpoint no funciona:', error);
    }
    console.log('\n');

    // Probar listar todos los endpoints disponibles
    console.log('3️⃣ Probando: /ldlms/v1');
    try {
      const endpoints = await fetchAPI('/ldlms/v1');
      console.log('Endpoints disponibles:');
      console.log(JSON.stringify(endpoints, null, 2));
    } catch (error) {
      console.log('❌ No se pudo listar endpoints:', error);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

investigate();
