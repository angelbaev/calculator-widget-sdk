type ModalOptions = {
    title: string;
    onSubmit: (formData: FormData) => void;
};

export class Modal {
    private modalElement: HTMLElement;
    private onSubmit: (formData: FormData) => void;

    constructor(options: ModalOptions) {
        this.onSubmit = options.onSubmit;
        this.modalElement = document.createElement('div');
        this.modalElement.classList.add('modal-backdrop');
        this.modalElement.innerHTML = `
        <style>
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.6);
          display: none;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-backdrop.open {
          display: flex;
        }
        
        .modal-content {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
          position: relative;
          box-shadow: 0 0 15px rgba(0,0,0,0.3);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-close {
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        
        .modal-content input[type="text"],
        .modal-content input[type="tel"],
        .modal-content input[type="email"],
        .modal-content input[type="file"] {
          border: 1px solid #ff6f0f;
          border-radius: 6px;
          padding: 0.5rem;
          width: 100%;
          box-sizing: border-box;
        }
        
        .modal-content .btn-primary {
          background-color: white;
          color: #ff6f0f;
          border: 1px solid #ff6f0f;
          padding: 0.5rem 1.2rem;
          border-radius: 6px;
          font-weight: 600;
          transition: background-color 0.3s, color 0.3s;
        }
        
        .modal-content .btn-primary:hover {
          background-color: #ff6f0f;
          color:#ff6f0f;
        }        
        </style>
      <div class="modal-content">
        <div class="modal-header">
          <h5>${options.title}</h5>
          <span class="modal-close" style="cursor:pointer">&times;</span>
        </div>
        <div class="modal-body">
          <div class="mb-2">
              <label>Име</label>
              <input type="text" class="form-control" id="name" />
          </div>
          <div class="mb-2">
              <label>Телефон</label>
              <input type="tel" class="form-control" id="phone" />
          </div>
          <div class="mb-2">
              <label>Имейл</label>
              <input type="email" class="form-control" id="email" />
          </div>
          <div class="mb-2">
              <label>Качи файл</label>
              <input type="file" class="form-control" id="fileUpload" />
          </div>
          <div class="mt-3 text-end">
              <button class="btn btn-primary" id="submitOrderBtn">Изпрати поръчка</button>
          </div>
        </div>
      </div>
    `;

        document.body.appendChild(this.modalElement);
        this.modalElement.querySelector('.modal-close')?.addEventListener('click', () => this.close());
        this.modalElement.querySelector('#submitOrderBtn')?.addEventListener('click', () => this.submit());
        this.modalElement.addEventListener('click', (e) => {
            if (e.target === this.modalElement) this.close();
        });
    }

    open() {
        this.modalElement.classList.add('open');
    }

    close() {
        this.modalElement.classList.remove('open');
    }

    private submit() {
        const name = (this.modalElement.querySelector('#name') as HTMLInputElement)?.value || '';
        const phone = (this.modalElement.querySelector('#phone') as HTMLInputElement)?.value || '';
        const email = (this.modalElement.querySelector('#email') as HTMLInputElement)?.value || '';
        const file = (this.modalElement.querySelector('#fileUpload') as HTMLInputElement)?.files?.[0] || null;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('email', email);
        if (file) formData.append('file', file);

        this.onSubmit(formData);
        this.close();
    }
}

export function createOrderModal(options: ModalOptions) {
    return new Modal(options);
}
