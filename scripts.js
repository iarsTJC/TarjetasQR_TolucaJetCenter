// Scripts para la Tarjeta de Presentación Digital Toluca Jet Center (Dynamic DOM Parser)

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // Manejo de Tabs (Contacto / Ubicación)
    // ==========================================================================
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");

            // Desactivar todos los botones y secciones
            tabBtns.forEach(b => b.classList.remove("active"));
            tabPanes.forEach(p => p.classList.remove("active"));

            // Activar botón y sección seleccionados
            btn.classList.add("active");
            const targetPane = document.getElementById(`tab-${targetTab}`);
            if (targetPane) targetPane.classList.add("active");
        });
    });

    // ==========================================================================
    // Descarga de Tarjeta de Contacto (vCard .vcf con lectura dinámica del DOM)
    // ==========================================================================
    const btnSaveContact = document.getElementById("btn-save-contact");

    if (btnSaveContact) {
        const downloadVCard = () => {
            // Leer datos directamente del DOM de la página actual
            const profileNameEl = document.querySelector(".profile-name");
            const profileTitleEl = document.querySelector(".profile-title");
            const companyLogoEl = document.querySelector(".airline-badge");
            
            const name = profileNameEl ? profileNameEl.textContent.trim() : "Contacto";
            
            // Extraer puesto quitando el texto de iconos Lucide que puedan estar adentro
            let title = "";
            if (profileTitleEl) {
                const clone = profileTitleEl.cloneNode(true);
                clone.querySelectorAll("i, svg").forEach(el => el.remove());
                title = clone.textContent.trim();
            }
            
            const org = companyLogoEl ? companyLogoEl.textContent.trim() : "Toluca Jet Center S.A. de C.V.";
            
            // Celular desde el botón de llamada principal
            const actionCall = document.getElementById("action-call");
            const mobile = actionCall ? actionCall.getAttribute("href").replace("tel:", "").trim() : "";
            
            // Buscar teléfonos de oficina en los items de contacto (evitando duplicar el celular si estuviera ahí)
            const officePhones = [];
            const telLinks = document.querySelectorAll('#tab-contacto a[href^="tel:"]');
            telLinks.forEach(link => {
                const telNum = link.getAttribute("href").replace("tel:", "").trim();
                if (telNum !== mobile && !officePhones.includes(telNum)) {
                    officePhones.push(telNum);
                }
            });
            
            // Buscar correos electrónicos
            const emails = [];
            const mailLinks = document.querySelectorAll('a[href^="mailto:"]');
            mailLinks.forEach(link => {
                const email = link.getAttribute("href").replace("mailto:", "").trim();
                if (!emails.includes(email)) {
                    emails.push(email);
                }
            });
            
            // Dirección
            const addressEl = document.querySelector(".address-text");
            let address = "";
            if (addressEl) {
                const clone = addressEl.cloneNode(true);
                clone.querySelectorAll("i, svg").forEach(el => el.remove());
                address = clone.textContent.replace(/\s+/g, " ").trim();
            }
            
            const webEl = document.querySelector(".website-link");
            const web = webEl ? webEl.getAttribute("href").trim() : "https://www.aeropartes.mx";
            
            const note = `${org} - FBO Premium & Aviación Ejecutiva.`;

            // Construir vCard 3.0
            const vcardLines = [
                "BEGIN:VCARD",
                "VERSION:3.0",
                `N:${name.split(" ").reverse().join(";")};;;;`,
                `FN:${name}`,
                `ORG:${org}`,
                `TITLE:${title}`,
            ];
            
            if (mobile) {
                vcardLines.push(`TEL;TYPE=CELL,VOICE:${mobile}`);
            }
            
            officePhones.forEach(phone => {
                vcardLines.push(`TEL;TYPE=WORK,VOICE:${phone}`);
            });
            
            emails.forEach((email, idx) => {
                if (idx === 0) {
                    vcardLines.push(`EMAIL;TYPE=PREF,INTERNET:${email}`);
                } else {
                    vcardLines.push(`EMAIL;TYPE=INTERNET:${email}`);
                }
            });
            
            vcardLines.push(`URL:${web}`);
            
            if (address) {
                vcardLines.push(`ADR;TYPE=WORK:;;${address.replace(/,/g, "\\,")}`);
            }
            
            vcardLines.push(`NOTE:${note}`);
            vcardLines.push("END:VCARD");

            const vcardContent = vcardLines.join("\r\n");

            // Convertir a blob y descargar
            const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8" });
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement("a");
            link.href = url;
            link.download = `${name.replace(/\s+/g, "_")}.vcf`;
            
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        };

        btnSaveContact.addEventListener("click", downloadVCard);
    }
});
