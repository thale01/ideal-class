import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Lock, Eye, FileText } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-main py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold mb-12 hover:opacity-80 transition-opacity">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <div className="card-premium p-10 md:p-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Shield size={24} />
                        </div>
                        <h1 className="text-4xl font-black text-bright">Privacy Policy</h1>
                    </div>

                    <p className="text-dim mb-10 leading-relaxed font-medium">
                        Last updated: March 31, 2026. Your privacy is paramount at Ideal Classes. 
                        We take the security of your academic and personal data extremely seriously.
                    </p>

                    <div className="space-y-12">
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="text-primary" size={18} />
                                <h2 className="text-xl font-bold text-bright">Data Collection</h2>
                            </div>
                            <p className="text-dim leading-relaxed">
                                We only collect information necessary for academic tracking and admission processing. 
                                This includes your name, email, contact number, and academic history. 
                                All data is encrypted and stored on secure cloud infrastructure.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <Eye className="text-primary" size={18} />
                                <h2 className="text-xl font-bold text-bright">Use of Information</h2>
                            </div>
                            <p className="text-dim leading-relaxed">
                                Your information is used strictly for internal academic purposes, 
                                attendance tracking, progress reporting, and official communication 
                                regarding your classes and success roadmap.
                            </p>
                        </section>

                        <section>
                           <div className="flex items-center gap-3 mb-4">
                                <FileText className="text-primary" size={18} />
                                <h2 className="text-xl font-bold text-bright">Third-Party Sharing</h2>
                            </div>
                            <p className="text-dim leading-relaxed">
                                Ideal Classes does not sell, trade, or otherwise transfer your personally 
                                identifiable information to outside parties. All data remains within 
                                our secure "Edu-Cloud" ecosystem.
                            </p>
                        </section>
                    </div>

                    <div className="mt-16 p-6 rounded-2xl bg-alt border border-subtle">
                        <p className="text-xs text-dim text-center">
                            For any privacy-related queries, please contact us at <span className="text-primary">privacy@ideal-classes.com</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
