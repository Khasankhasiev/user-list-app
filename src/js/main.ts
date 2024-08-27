import { fetchUsers } from './api';
import '../css/style.scss';

interface User {
    id: number;
    name: string;
    email: string;
    address: {
        street: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        };
    };
    company: {
        name: string;
    };
}

let users: User[] = [];
let sortOrder: 'asc' | 'desc' = 'asc';

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});

async function loadUsers() {
    try {
        users = await fetchUsers();
        renderTable(users);
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function renderTable(data: User[]) {
    const tbody = document.querySelector('#userTable tbody') as HTMLElement;
    tbody.innerHTML = '';
    data.forEach(user => {
        const mapLink = `https://www.google.com/maps?q=${user.address.geo.lat},${user.address.geo.lng}`;
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${user.name}</td>
      <td><a href="mailto:${user.email}">${user.email}</a></td>
      <td class='address'><a href="${mapLink}" target="_blank">Улица <span class='plate street'>${user.address.street}</span> Индекс <span class='plate zipcode'>${user.address.zipcode}</span></td>
      <td>${user.company.name}</td>
    `;
        tbody.appendChild(row);
    });
}

function sortTable(field: keyof User | 'address' | 'company') {
    const order = sortOrder === 'asc' ? 'desc' : 'asc';

    users.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        if (field === 'address') {
            aValue = a.address.city.toLowerCase();
            bValue = b.address.city.toLowerCase();
        } else if (field === 'company') {
            aValue = a.company.name.toLowerCase();
            bValue = b.company.name.toLowerCase();
        } else {
            aValue =
                typeof a[field] === 'string'
                    ? (a[field] as string).toLowerCase()
                    : a[field];
            bValue =
                typeof b[field] === 'string'
                    ? (b[field] as string).toLowerCase()
                    : b[field];
        }

        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
    });

    sortOrder = order;
    renderTable(users);
}

(window as any).sortTable = sortTable;

function refreshData() {
    loadUsers();
}

(window as any).refreshData = refreshData;
