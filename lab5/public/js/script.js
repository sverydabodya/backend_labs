async function fetchAll() {
    const response = await fetch('/labs/lab4/api/rams');
    const data = await response.json();
    renderTable(data);
}

async function fetchData() {
    const id = document.getElementById('searchId').value;
    if (!id) return fetchAll();
    
    const response = await fetch(`/labs/lab4/api/rams?id=${id}`);
    if (response.status === 404) {
        document.getElementById('tableBody').innerHTML = '<tr><td colspan="5">Не знайдено</td></tr>';
        return;
    }
    const data = await response.json();
    renderTable([data]);
}

function renderTable(items) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    items.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.modelName}</td>
                <td>${item.capacityGb}</td>
                <td>${item.price}</td>
                <td>${item.manufacturer.name} (${item.manufacturer.country})</td>
            </tr>
        `;
    });
}

window.onload = fetchAll;