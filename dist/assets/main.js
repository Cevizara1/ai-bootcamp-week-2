import { ApiRequestError, getHealth, getPreparationItems, getPreparationSummary } from "./apiClient.js";
class InterviewPreparationPage {
    environmentLabel = requireElement('environment-label');
    environmentMessage = requireElement('environment-message');
    serviceStatus = requireElement('service-status');
    itemsList = requireElement('preparation-items', HTMLUListElement);
    itemsStatus = requireElement('items-status');
    summaryStatus = requireElement('summary-status');
    totalValue = requireElement('summary-total');
    completedValue = requireElement('summary-completed');
    remainingValue = requireElement('summary-remaining');
    percentageValue = requireElement('summary-percentage');
    refreshButton = requireElement('refresh-data', HTMLButtonElement);
    start() {
        this.refreshButton.addEventListener('click', () => void this.refresh());
        void this.refresh();
    }
    async refresh() {
        this.refreshButton.disabled = true;
        this.itemsStatus.textContent = 'Učitavanje stavki...';
        this.summaryStatus.textContent = 'Učitavanje pregleda...';
        await Promise.allSettled([
            this.loadHealth(),
            this.loadItems(),
            this.loadSummary()
        ]);
        this.refreshButton.disabled = false;
    }
    async loadHealth() {
        try {
            const health = await getHealth();
            this.environmentLabel.textContent = health.environment;
            this.environmentMessage.textContent = health.message;
            this.serviceStatus.textContent = health.preparationServiceConfigured
                ? 'Servisna konfiguracija je pronađena.'
                : 'Servisna konfiguracija nedostaje.';
            this.serviceStatus.dataset.state = health.preparationServiceConfigured ? 'ok' : 'error';
        }
        catch (error) {
            this.serviceStatus.textContent = describeError(error);
            this.serviceStatus.dataset.state = 'error';
        }
    }
    async loadItems() {
        try {
            const items = await getPreparationItems();
            this.renderItems(items);
            this.itemsStatus.textContent = `${items.length} stavki je učitano iz pripremljenog izvora.`;
            this.itemsStatus.dataset.state = 'ok';
        }
        catch (error) {
            this.itemsList.replaceChildren();
            this.itemsStatus.textContent = describeError(error);
            this.itemsStatus.dataset.state = 'error';
        }
    }
    async loadSummary() {
        try {
            const summary = await getPreparationSummary();
            this.renderSummary(summary);
            this.summaryStatus.textContent = 'Pregled je izračunat na serveru.';
            this.summaryStatus.dataset.state = 'ok';
        }
        catch (error) {
            this.clearSummary();
            this.summaryStatus.textContent = describeError(error);
            this.summaryStatus.dataset.state = 'error';
        }
    }
    renderItems(items) {
        const listItems = items.map((item) => {
            const element = document.createElement('li');
            element.className = item.completed ? 'preparation-item completed' : 'preparation-item';
            const marker = document.createElement('span');
            marker.className = 'item-marker';
            marker.textContent = item.completed ? '✓' : '○';
            marker.setAttribute('aria-hidden', 'true');
            const title = document.createElement('span');
            title.textContent = item.title;
            element.append(marker, title);
            return element;
        });
        this.itemsList.replaceChildren(...listItems);
    }
    renderSummary(summary) {
        this.totalValue.textContent = String(summary.total);
        this.completedValue.textContent = String(summary.completed);
        this.remainingValue.textContent = String(summary.remaining);
        this.percentageValue.textContent = `${summary.percentage}%`;
    }
    clearSummary() {
        this.totalValue.textContent = '–';
        this.completedValue.textContent = '–';
        this.remainingValue.textContent = '–';
        this.percentageValue.textContent = '–';
    }
}
function requireElement(id, constructorFunction) {
    const element = document.getElementById(id);
    if (!element || (constructorFunction && !(element instanceof constructorFunction))) {
        throw new Error(`Nedostaje očekivani element #${id}.`);
    }
    return element;
}
function describeError(error) {
    if (error instanceof ApiRequestError) {
        return `API greška ${error.status}: ${error.message}`;
    }
    return error instanceof Error ? error.message : 'Nepoznata greška.';
}
try {
    new InterviewPreparationPage().start();
}
catch (error) {
    console.error(error);
}
