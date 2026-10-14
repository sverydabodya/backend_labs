async function fetchFromApi() {
    console.log("=== Запит списку всіх ОЗП через Node.js (cURL аналог) ===");
    
    try {
        const responseAll = await fetch('http://localhost:3000/api/rams');
        const dataAll = await responseAll.json();
        console.log("Усі записи:", dataAll);

        console.log("\n=== Запит одного запису (ID: 102) ===");
        const responseOne = await fetch('http://localhost:3000/api/rams?id=102');
        const dataOne = await responseOne.json();
        console.log("Один запис:", dataOne);

        console.log("\n=== Запит неіснуючого запису (ID: 999) ===");
        const responseNotFound = await fetch('http://localhost:3000/api/rams?id=999');
        console.log("Статус код:", responseNotFound.status);
        const dataNotFound = await responseNotFound.json();
        console.log("Відповідь:", dataNotFound);

    } catch (error) {
        console.error("Помилка з'єднання. Переконайтеся, що сервер api.ts запущено.", error);
    }
}

fetchFromApi();