export default class AboutPage {
  async render() {
    return this.generateContent();
  }

  generateContent() {
    return `
      <section class="about-page-custom">
        <div class="about-container">
          <h2 class="about-title">Tentang Pengembang</h2>
          <p><strong>Nama:</strong> Rivka Novi Cahyati</p>
          <p><strong>NIM:</strong> FC613D5X0908</p>
          <p><strong>Kelas:</strong> FC-13</p>
          <p>
            Saya adalah mahasiswa Universitas Mercu Buana Yogyakarta yang tengah mengikuti program belajar dari Dicoding. 
            Proyek ini dibuat sebagai bagian dari pengembangan kemampuan di bidang front-end development, dengan harapan 
            dapat memberikan pengalaman belajar yang nyata dan bermanfaat.
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    document.querySelector('.about-container')?.classList.add('fade-slide');
  }
}
