import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { form, FormField, min, minLength, required } from '@angular/forms/signals';

import { ProductsPresenter } from '@products/features/products/products.presenter';
import { ProductCardComponent } from '@products/features/products/components';

/**
 * Product catalog screen with a resource-backed query and a signal-driven create form.
 *
 * @example
 * <app-products-page />
 */
@Component({
  selector: 'app-products-page',
  imports: [FormField, ProductCardComponent],
  providers: [ProductsPresenter],
  template: `
    <section class="page">
      <header class="page-heading">
        <div>
          <p class="eyebrow">Catalogue</p>
          <h1>Produits</h1>
          <p class="intro">Explorez le catalogue, filtrez les références et ajoutez un produit.</p>
        </div>
        <span class="count" aria-live="polite"
          >{{ presenter.filteredProducts().length }} résultat(s)</span
        >
      </header>

      <section class="catalog" aria-labelledby="catalog-title">
        <h2 id="catalog-title">Références disponibles</h2>
        <div class="filters">
          <label class="search">
            <span>Rechercher</span>
            <input
              type="search"
              [value]="presenter.searchTerm()"
              (input)="presenter.searchTerm.set(readText($event))"
              placeholder="Nom ou description"
            />
          </label>
          <label>
            <span>Catégorie</span>
            <select
              [value]="presenter.category()"
              (change)="presenter.category.set(readCategory($event))"
            >
              @for (category of presenter.categories; track category) {
                <option [value]="category">
                  {{ category === 'all' ? 'Toutes les catégories' : category }}
                </option>
              }
            </select>
          </label>
        </div>

        @if (presenter.products.isLoading()) {
          <p class="feedback" role="status">Chargement du catalogue…</p>
        } @else if (presenter.loadError()) {
          <div class="feedback error" role="alert">
            <p>Le catalogue n’a pas pu être chargé : {{ presenter.loadErrorMessage() }}</p>
            <button type="button" class="secondary" (click)="presenter.products.reload()">
              Réessayer
            </button>
          </div>
        } @else if (presenter.filteredProducts().length === 0) {
          <p class="feedback">Aucun produit ne correspond à ces critères.</p>
        } @else {
          <div class="product-grid">
            @for (product of presenter.filteredProducts(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        }
      </section>

      <section class="create-panel" aria-labelledby="create-title">
        <div>
          <p class="eyebrow">Commande</p>
          <h2 id="create-title">Ajouter un produit</h2>
          <p class="intro">Les commandes d’écriture sont séparées des queries de lecture.</p>
        </div>
        <form (submit)="$event.preventDefault(); presenter.createProduct()">
          <div class="form-grid">
            <label>
              <span>Nom</span>
              <input [formField]="productForm.name" autocomplete="off" />
              @if (productForm.name().invalid() && productForm.name().touched()) {
                <span class="field-error">{{ productForm.name().errors()[0]?.message }}</span>
              }
            </label>
            <label>
              <span>Catégorie</span>
              <select [formField]="productForm.category">
                <option value="tech">Tech</option>
                <option value="wellness">Bien-être</option>
                <option value="home">Maison</option>
              </select>
            </label>
            <label>
              <span>Prix (EUR)</span>
              <input type="number" step="0.01" [formField]="productForm.price" />
              @if (productForm.price().invalid() && productForm.price().touched()) {
                <span class="field-error">{{ productForm.price().errors()[0]?.message }}</span>
              }
            </label>
            <label>
              <span>Stock</span>
              <input type="number" step="1" [formField]="productForm.stock" />
              @if (productForm.stock().invalid() && productForm.stock().touched()) {
                <span class="field-error">{{ productForm.stock().errors()[0]?.message }}</span>
              }
            </label>
            <label class="wide">
              <span>Description</span>
              <textarea rows="3" [formField]="productForm.description"></textarea>
              @if (productForm.description().invalid() && productForm.description().touched()) {
                <span class="field-error">{{
                  productForm.description().errors()[0]?.message
                }}</span>
              }
            </label>
          </div>
          @if (presenter.saveError()) {
            <p class="form-feedback error" role="alert">{{ presenter.saveError() }}</p>
          }
          @if (presenter.saveMessage()) {
            <p class="form-feedback success" role="status">{{ presenter.saveMessage() }}</p>
          }
          <button type="submit" [disabled]="presenter.saving()">
            {{ presenter.saving() ? 'Enregistrement…' : 'Créer le produit' }}
          </button>
        </form>
      </section>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .page {
      display: grid;
      gap: 1.5rem;
    }
    .page-heading {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 1rem;
    }
    .eyebrow {
      margin: 0 0 0.35rem;
      color: #0f766e;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    h1,
    h2 {
      margin: 0;
      color: #0f172a;
    }
    h1 {
      font-size: clamp(2rem, 5vw, 3rem);
    }
    h2 {
      font-size: 1.25rem;
    }
    .intro {
      margin: 0.5rem 0 0;
      color: #475569;
      line-height: 1.55;
    }
    .count {
      white-space: nowrap;
      color: #334155;
      font-weight: 700;
    }
    .catalog,
    .create-panel {
      display: grid;
      gap: 1rem;
      padding: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid #dbe4ee;
      border-radius: 1rem;
      background: #fff;
    }
    .filters,
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 0.85rem;
    }
    label {
      display: grid;
      gap: 0.35rem;
      color: #334155;
      font-size: 0.9rem;
      font-weight: 650;
    }
    input,
    select,
    textarea {
      box-sizing: border-box;
      width: 100%;
      min-height: 2.75rem;
      padding: 0.65rem 0.75rem;
      border: 1px solid #94a3b8;
      border-radius: 0.5rem;
      background: #fff;
      color: #0f172a;
      font: inherit;
    }
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible,
    button:focus-visible {
      outline: 3px solid #5eead4;
      outline-offset: 2px;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 1rem;
    }
    .feedback {
      margin: 0;
      padding: 1rem;
      border-radius: 0.6rem;
      background: #f1f5f9;
      color: #334155;
    }
    .error {
      color: #991b1b;
      background: #fef2f2;
    }
    .success {
      color: #166534;
      background: #f0fdf4;
    }
    .create-panel {
      grid-template-columns: minmax(190px, 0.65fr) minmax(0, 1.35fr);
      align-items: start;
    }
    form {
      display: grid;
      gap: 1rem;
    }
    .wide {
      grid-column: 1 / -1;
    }
    .form-feedback {
      margin: 0;
      padding: 0.75rem;
      border-radius: 0.5rem;
    }
    .field-error {
      color: #991b1b;
      font-size: 0.8rem;
      font-weight: 650;
    }
    button {
      justify-self: start;
      min-height: 2.75rem;
      padding: 0.65rem 1rem;
      border: 0;
      border-radius: 0.5rem;
      background: #0f766e;
      color: #fff;
      font: inherit;
      font-weight: 750;
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.6;
      cursor: wait;
    }
    button.secondary {
      background: #334155;
    }
    @media (max-width: 700px) {
      .page-heading {
        align-items: start;
        flex-direction: column;
      }
      .create-panel {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPage {
  readonly presenter = inject(ProductsPresenter);
  readonly productForm = form(this.presenter.draft, (path) => {
    required(path.name);
    minLength(path.name, 2);
    min(path.price, 0);
    min(path.stock, 0);
    minLength(path.description, 5);
  });

  protected readText(event: Event): string {
    return event.target instanceof HTMLInputElement ? event.target.value : '';
  }

  protected readCategory(event: Event): (typeof this.presenter.categories)[number] {
    const value = event.target instanceof HTMLSelectElement ? event.target.value : 'all';
    return this.presenter.categories.find((category) => category === value) ?? 'all';
  }
}
